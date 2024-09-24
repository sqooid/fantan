onRecordAfterCreateRequest((e) => {
	const record = e.record;
	if (!record) return;
	const reaction = record.getString('reaction');

	$app.dao().expandRecord(record, ['comment'], null as any);
	const comment = record.expandedOne('comment');

	const reactionsMap = (JSON.parse(comment.getString('reactions')) ?? {}) as Record<string, number>;
	const currentCount = reactionsMap[reaction] ?? 0;
	reactionsMap[reaction] = currentCount + 1;
	comment.set('reactions', reactionsMap);
	$app.dao().saveRecord(comment);
}, 'chapterCommentReactions');

onRecordAfterDeleteRequest((e) => {
	const record = e.record;
	if (!record) return;
	const reaction = record.getString('reaction');

	$app.dao().expandRecord(record, ['comment'], null as any);
	const comment = record.expandedOne('comment');

	const reactionsMap = (JSON.parse(comment.getString('reactions')) ?? {}) as Record<string, number>;
	const currentCount = reactionsMap[reaction] ?? 0;
	if (currentCount <= 1) {
		delete reactionsMap[reaction];
	} else {
		reactionsMap[reaction] = currentCount - 1;
	}
	reactionsMap[reaction] = currentCount + 1;
	comment.set('reactions', reactionsMap);
	$app.dao().saveRecord(comment);
}, 'chapterCommentReactions');

routerAdd('POST', '/c/toggle-reaction', (e) => {
	const { comment, reaction } = $apis.requestInfo(e).data;
	const user = $apis.requestInfo(e).authRecord?.id;
	if (!user) return e.json(401, { message: 'Unauthorized' });
	const commentRecord = $app.dao().findRecordById('chapterComments', comment);
	const reactionMap = (JSON.parse(commentRecord.getString('reactions') || 'null') ?? {}) as Record<
		string,
		number
	>;
	const reactionRecord = $app.dao().findRecordsByExpr(
		'chapterCommentReactions',
		$dbx.exp('comment = {:comment} AND reaction = {:reaction} AND user = {:user}', {
			comment,
			reaction,
			user
		})
	)[0];
	const exists = reactionRecord !== undefined;

	let count = 0;
	// TODO: update number from aggregate reaction records if desync becomes a problem
	if (exists) {
		if (reactionMap[reaction] <= 1) {
			delete reactionMap[reaction];
		} else {
			count = reactionMap[reaction] - 1;
			reactionMap[reaction] = count;
		}
	} else {
		count = (reactionMap[reaction] ?? 0) + 1;
		reactionMap[reaction] = count;
	}
	commentRecord.set('reactions', reactionMap);

	$app.dao().runInTransaction((tx) => {
		if (exists) {
			tx.deleteRecord(reactionRecord);
		} else {
			const col = $app.dao().findCollectionByNameOrId('chapterCommentReactions');
			const newRecord = new Record(col, {
				comment,
				reaction,
				user
			});
			tx.saveRecord(newRecord);
		}
		tx.saveRecord(commentRecord);
	});
	return e.json(200, { reaction, count });
});

onRecordAfterUpdateRequest((e) => {
	const body = $apis.requestInfo(e.httpContext).data;
	if (body.content) {
		const record = e.record;
		if (!record) return;
		const updated = record.getDateTime('updated');
		record.set('contentUpdated', updated);
		$app.dao().saveRecord(record);
	}
}, 'chapterComments');

const { MongoClient } = require('mongodb');
const uri =
    'mongodb+srv://ecomm:0Ax6t45R3tdgU8oR@cluster0.z4xh1w1.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri);

// eslint-disable-next-line no-unused-vars
class dbExecutor {
    constructor() {}

    async insert_cart_item(user_id, items) {
        var rec = {
            user_id: user_id,
            items,
            placed: false,
        };

        try {
            await client.connect();
            const query = { user_id: user_id, placed: false };
            let newdoc = await client
                .db('main')
                .collection('order')
                .findOne(query);

            if (newdoc == null) {
                await client
                    .db('main')
                    .collection('order')
                    .insertOne(rec)
                    .catch();
            } else {
                const update_query = { user_id: user_id };

                // add the current coffee into the document
                await client
                    .db('main')
                    .collection('order')
                    .updateOne(update_query, {
                        $push: { items: { $each: items } },
                    });

                // aggregate duplicated coffees
                const agg = [
                    { $unwind: '$items' },
                    {
                        $group: {
                            _id: '$items.coffee',
                            number: { $sum: '$items.number' },
                        },
                    },
                    {
                        $group: {
                            _id: 0,
                            items: {
                                $push: { coffee: '$_id', number: '$number' },
                            },
                        },
                    },
                    { $project: { _id: 0, items: 1 } },
                ];

                const result = await client
                    .db('main')
                    .collection('order')
                    .aggregate(agg);

                for await (const doc of result) {
                    await client
                        .db('main')
                        .collection('order')
                        .updateOne({ user_id: user_id }, { $set: doc });
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
}

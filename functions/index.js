const admin = require('firebase-admin');
const functions = require('firebase-functions');

const firebaseConfig = {
  // ...
  storageBucket: process.env.FIREBASE_STORAGE_ID,
  projectId: process.env.FIREBASE_PROJECT_ID,
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.FIREBASE_MESSAGAING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

admin.initializeApp(firebaseConfig);
const db = admin.firestore();

exports.notionPostUpdate = functions
  .region('asia-northeast3')
  .https.onRequest(async (request, response) => {
    // eslint-disable-next-line global-require
    const { Client } = require('@notionhq/client');
    // eslint-disable-next-line global-require
    const { NotionToMarkdown } = require('notion-to-md');

    const notion = new Client({
      auth: process.env.NOTION_KEY,
    });

    const n2m = new NotionToMarkdown({ notionClient: notion });

    const blogPages = await notion.databases
      .query({
        database_id: process.env.NOTION_DATABASE_KEY,
      })
      .then((data) => {
        const blogPageIdList = data.results.filter((e) => {
          return e.object === 'page';
        });

        const blogPagesMap = blogPageIdList
          .map((post) => {
            return {
              category: post.properties.category.select.name,
              plain_title: `${post.properties.이름.title[0].plain_text}`,
              title: `${post.icon?.emoji ? `${post.icon.emoji} ` : ''}${
                post.properties.이름.title[0].plain_text
              }`,
              thumbnail: post.cover?.external.url ?? '',
              createdAt: new Date(post.created_time).toLocaleDateString('ko-KR'),
              tags: post.properties.tags.multi_select,
              index: post.id,
              description: post.properties.description.rich_text[0]?.plain_text ?? '',
              last_editedAt: new Date(post.last_edited_time).toLocaleDateString('ko-KR'),
            };
          })
          .sort((a, b) => {
            return a.createdAt < b.createdAt ? 1 : -1;
          });

        return blogPagesMap;
      });

    // Firestore에 데이터 추가
    blogPages.forEach((page) => {
      db.collection(`${page.category}`)
        .doc(`${page.index}`)
        .set({
          plain_title: page.plain_title,
          title: page.title,
          thumbnail: page.thumbnail,
          tags: page.tags,
          index: page.index,
          description: page.description,
          createdAt: page.createdAt,
          last_editedAt: page.last_editedAt,
        })
        .then(() => {
          response.send('Data added to Firestore!');
        })
        .catch((error) => {
          console.error('Error adding data to Firestore:', error);
          response.status(500).send('Error adding data to Firestore');
        });
    });
  });

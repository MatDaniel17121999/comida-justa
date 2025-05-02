import { test, expect } from "@playwright/test";
import CommentPage from "./CommentPage";
import { simulateLogin, deleteSession, type DbSession } from "../simulateLogin";
import { dummyDbUser } from "../dummies/session";
<<<<<<< HEAD
=======
import { deleteCommentsByPostSlug } from "../deleteComments";
>>>>>>> upstream/dev

// test.use({
//   storageState: './src/e2e/.auth/auth.json'
// });

test.describe("Given an authenticated user viewing a post", () => {
  let commentPage: CommentPage;
  let dbSession: DbSession | undefined;
<<<<<<< HEAD
=======
  const postSlug = 'verduras-y-semillas-frescas'
>>>>>>> upstream/dev

  test.beforeEach(async ({ page, browserName }) => {
    dbSession = await simulateLogin(page, browserName)
    commentPage = new CommentPage(page);
<<<<<<< HEAD
    await commentPage.goToPost('verduras-y-semillas-frescas');
=======
    await commentPage.goToPost(postSlug);
>>>>>>> upstream/dev
  });

  test.afterEach(async () => {
    await deleteSession(dbSession.id)
<<<<<<< HEAD
=======
    await deleteCommentsByPostSlug(postSlug)
>>>>>>> upstream/dev
  });

  test.describe("When the user writes a comment", () => {
    test("Then the comment should appear with the user's name", async () => {
      const comment = "Esta ensalada se ve deliciosa!";

      await commentPage.fillComment(comment);
      await commentPage.submitComment();

      await commentPage.verifyCommentDisplayed(comment);
      await commentPage.verifyCommentAuthor(dummyDbUser.name);
    });
  });
});

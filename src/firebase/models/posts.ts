import type {
  WhereFilterOp,
  CollectionReference,
} from "firebase-admin/firestore";
import type { FirestorePost } from "./Posts.d";
import type { Post, PostUser } from "~/types/Posts.d";
import { Timestamp } from "firebase-admin/firestore";
import { createFileInStorage, validateFields, collections, defineSlug, validateFileAnGetType } from "./postUtils";
 

export async function createPost(postInfo: Post, file: File, user: PostUser) {
  validateFields(postInfo, file, user);

  const slug = await defineSlug(postInfo.title as string, postInfo.slug as string);

  let type: string | null = null;
  try {
    type = await validateFileAnGetType(file);
  } catch (error: any) {
    return {
      error,
      errorMessage: "El archivo no es un tipo de archivo válido",
    };
  }

  let fileUrl = "";
  try {
    fileUrl = await createFileInStorage(file);
  } catch (error: any) {
    return {
      error,
      errorMessage: "Algo salió mal al crear y/o obtener el archivo del post en el storage",
    };
  }

  try {
    const post = await collections.posts().add({
      ...postInfo,
      slug,
      media: {
        url: fileUrl,
        type,
        alt: postInfo.title,
      },
      user,
      createdAt: Timestamp.now(),
    });

    return { id: post.id, slug };
  } catch (error: any) {
    return {
      error,
      errorMessage: "Algo salió mal al crear el post",
    };
  }
}

export async function getPost(
  slug: string,
  collection: CollectionReference<FirestorePost> = collections.posts()
) {
  try {
    const queryResult = await collection.where("slug", "==", slug).get();

    if (queryResult.empty) {
      return {
        errorMessage: "No se encontró el post",
      };
    }

    const postInfo = {
      ...queryResult.docs[0]?.data(),
      id: queryResult.docs[0]?.id,
    };

    return postInfo;
  } catch (error: any) {
    return {
      error,
      errorMessage: "Algo salió mal al buscar/obtener el post",
    };
  }
}
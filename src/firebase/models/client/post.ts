import { collection, getDocs, query, orderBy, limit, startAfter, where } from "firebase/firestore";
import { db } from "~/firebase/models/client";

export async function getPosts(pageSize = 10, startAfterDoc: any = null, filter: null | { field: string; operator: any; value: string } = null) {
  
  let baseQuery = collection(db, "posts");
  let constraints: any[] = [];

  if (filter) {
    constraints.push(where(filter.field, filter.operator, filter.value));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (startAfterDoc) {
    constraints.push(startAfter(startAfterDoc));
  }

  constraints.push(limit(pageSize));

  const postsQuery = query(baseQuery, ...constraints);

  const snapshot = await getDocs(postsQuery);

  const posts = snapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));

  const lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;

  return {
    posts,
    lastVisible,
    hasMore: !snapshot.empty
  };
}
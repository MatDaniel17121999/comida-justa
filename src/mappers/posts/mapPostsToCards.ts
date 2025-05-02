import type { Post } from "~/types/Posts.d";
import { Timestamp } from "firebase/firestore";

export function mapPostsToCards(posts: Post[]) {
  return posts.map((item: Post) => {
    let createdAtDate: Date | null = null;

    if (item.createdAt instanceof Timestamp) {
      createdAtDate = item.createdAt.toDate();
    } else if (item.createdAt instanceof Date) {
      createdAtDate = item.createdAt;
    } else if (typeof item.createdAt === "string") {
      createdAtDate = new Date(item.createdAt);
    }

    return {
      id: item.id,
      title: item.title,
      price: item.price,
      content: item.content,
      media: item.media,
      createdAt: createdAtDate,
      createdAtLocale: createdAtDate?.toLocaleString("es-MX", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
      user: item.user,
      summary: item.summary,
      to:
        item.slug ??
        `${item.title?.toLowerCase()?.replace(/\s/g, "-")}-${item.id}`,
    };
  });
}

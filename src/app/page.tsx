'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Card from "~/components/ui/Card";
import CurrencyAmount from "~/components/ui/CurrencyAmount";
import { getPosts } from "~/firebase/models/client/post";
import { mapPostsToCards } from "~/mappers/posts/mapPostsToCards";
import { Post } from "~/types/Posts";
import MediaContent from "~/components/ui/MediaContent/MediaContent";

export default function Inicio() {
  const [foods, setFoods] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    loadMoreFoods();
  }, []);

  useEffect(() => {
    if (loading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMoreFoods();
      }
    });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }
  }, [loading, hasMore]);

  const loadMoreFoods = async () => {
    if (loading) return;

    setLoading(true);
    const result = await getPosts(10, lastDoc);
    const newFoods = mapPostsToCards(result.posts);

    setFoods(prev => [...prev, ...newFoods]);
    setLastDoc(result.lastVisible);
    setHasMore(result.hasMore);
    setLoading(false);
  };


  return (
    <main className="">
      <h1 className="text-xl font-bold">
        Comida Justa: ¿Como evitar enfermedades, ahorrar tiempo y dinero, al
        mismo tiempo que apoyas al medio ambiente y a tu comunidad?
      </h1>
      <section
        className="grid grid-flow-dense gap-4 pt-6 max-sm:grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))]"
      >
        {
          foods.length === 0 ?
            <p>No hay comidas publicadas aún.</p>
            :
            foods.map((food: Post) => {
              return <CardForList {...food} key={food.id} />;
            })
        }
      </section>
    </main>
  );
}

function CardForList(props: Post) {
  const { id, title, media, createdAt, createdAtLocale, price, user, to } = props;
  const anchorProps = { href: to, title: title };
  return (
    <Card
      key={id}
      title={title}
      createdAt={createdAt}
      createdAtLocale={createdAtLocale}
      user={user}
      className="flex flex-col justify-between bg-white dark:bg-pw-gray rounded-3xl overflow-hidden hover:border-b-pw-lightgreen dark:border-t-0 dark:border-r-0 dark:border-l-0 border-b-8 border-b-transparent"
      AnchorElement={Link}
      anchorProps={anchorProps}
      media={
        <Link {...anchorProps}>
          <MediaContent media={media} />
        </Link>
      }
    >
      <CurrencyAmount
        value={price}
        locale="es-MX"
        currency="MXN"
      ></CurrencyAmount>
    </Card>
  );
}

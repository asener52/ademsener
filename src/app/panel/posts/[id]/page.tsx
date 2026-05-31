import { queryOne } from "@/lib/db";
import { notFound } from "next/navigation";
import { PostEditor } from "@/components/admin/post-editor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await queryOne<any>("SELECT * FROM posts WHERE id = ?", [id]);
  if (!post) notFound();
  if (post.tags && typeof post.tags === "string") {
    try { post.tags = JSON.parse(post.tags); } catch { post.tags = []; }
  }
  return <PostEditor post={post} mode="edit" />;
}

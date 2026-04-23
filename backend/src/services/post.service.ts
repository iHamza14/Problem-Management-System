/**
 * Post Service — Prisma queries for blog/discussion CRUD
 * Updated for new schema: User doesn't have handle directly, uses UserPlatformHandle
 */
import { prisma } from "../prismac";

// Consistent author select shape (includes CF handles)
const authorSelect = {
  id: true,
  email: true,
  handles: {
    include: { platform: true },
  },
};

/* ───────── POST QUERIES ───────── */

/** Fetch paginated posts with author, like count, comment count, and tags */
export async function listPosts(page: number = 1, limit: number = 10, search?: string) {
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: authorSelect },
        tags: { include: { tag: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, page, totalPages: Math.ceil(total / limit) };
}

/** Fetch single post with full comments tree and like info */
export async function getPostById(postId: string, userId?: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: { select: authorSelect },
      tags: { include: { tag: true } },
      comments: {
        orderBy: { createdAt: "asc" },
        include: {
          user: { select: authorSelect },
          _count: { select: { likes: true } },
        },
      },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!post) return null;

  // Check if current user has liked this post
  let userLiked = false;
  if (userId) {
    const like = await prisma.postLike.findUnique({
      where: { userId_postId: { userId, postId } },
    });
    userLiked = !!like;
  }

  return { ...post, userLiked };
}

/** Create a new post */
export async function createPost(
  authorId: string,
  title: string,
  content: string,
  tagNames: string[] = []
) {
  // Upsert tags first
  const tagRecords = await Promise.all(
    tagNames.map((name) =>
      prisma.tag.upsert({
        where: { name: name.toLowerCase().trim() },
        create: { name: name.toLowerCase().trim() },
        update: {},
      })
    )
  );

  const post = await prisma.post.create({
    data: {
      authorId,
      title,
      content,
      tags: {
        create: tagRecords.map((t) => ({ tagId: t.id })),
      },
    },
    include: {
      author: { select: authorSelect },
      tags: { include: { tag: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return post;
}

/* ───────── LIKE QUERIES ───────── */

/** Toggle like on a post — returns new like status */
export async function togglePostLike(userId: string, postId: string) {
  const existing = await prisma.postLike.findUnique({
    where: { userId_postId: { userId, postId } },
  });

  if (existing) {
    await prisma.postLike.delete({
      where: { userId_postId: { userId, postId } },
    });
    return { liked: false };
  } else {
    await prisma.postLike.create({ data: { userId, postId } });
    return { liked: true };
  }
}

/** Toggle like on a comment */
export async function toggleCommentLike(userId: string, commentId: string) {
  const existing = await prisma.commentLike.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  if (existing) {
    await prisma.commentLike.delete({
      where: { userId_commentId: { userId, commentId } },
    });
    return { liked: false };
  } else {
    await prisma.commentLike.create({ data: { userId, commentId } });
    return { liked: true };
  }
}

/* ───────── COMMENT QUERIES ───────── */

/** Add a comment to a post (optionally as a reply) */
export async function addComment(
  postId: string,
  userId: string,
  content: string,
  parentId?: string
) {
  return prisma.comment.create({
    data: { postId, userId, content, parentId },
    include: {
      user: { select: authorSelect },
      _count: { select: { likes: true } },
    },
  });
}

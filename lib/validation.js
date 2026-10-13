import { z } from 'zod';
import { NextResponse } from 'next/server';

// ─── Reusable helpers ────────────────────────────────────────────────────────

const mongoId = z.string().regex(/^[a-f0-9]{24}$/i, 'Invalid ID');
const nonEmptyString = (max = 5000) => z.string().min(1).max(max).trim();
const optionalUrl = z.string().url().optional().or(z.literal(''));

// ─── Blog ─────────────────────────────────────────────────────────────────────

export const createBlogSchema = z.object({
  title: nonEmptyString(300),
  content: nonEmptyString(100_000),
  excerpt: z.string().max(500).optional(),
  coverImage: optionalUrl,
  tags: z.string().max(500).optional(), // comma-separated
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(1).max(300).trim().optional(),
  content: z.string().min(1).max(100_000).optional(),
  excerpt: z.string().max(500).optional(),
  coverImage: optionalUrl,
  tags: z.string().max(500).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
});

// ─── Forum ────────────────────────────────────────────────────────────────────

const FORUM_CATEGORIES = [
  'Peer Pressure',
  'Parental Pressure',
  'Self-Care & Wellness',
  'Academic Stress',
  'General Support',
];

export const createTopicSchema = z.object({
  title: nonEmptyString(300),
  content: nonEmptyString(10_000),
  category: z.enum(FORUM_CATEGORIES),
});

export const updateTopicSchema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED']),
});

export const createReplySchema = z.object({
  content: nonEmptyString(5_000),
});

// ─── Events ───────────────────────────────────────────────────────────────────

export const createEventSchema = z.object({
  title: nonEmptyString(300),
  description: nonEmptyString(10_000),
  coverImage: optionalUrl,
  date: z.string().datetime({ message: 'Invalid date format' }),
  time: z.string().max(50).optional(),
  venue: z.string().max(300).optional(),
  meetingLink: optionalUrl,
  type: z.enum(['UPCOMING', 'PAST']).optional(),
  gallery: z.string().optional(), // JSON array string
  recap: z.string().max(10_000).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const createEventCommentSchema = z.object({
  content: nonEmptyString(2_000),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  userName: z.string().max(100).optional(),
});

// ─── Team ─────────────────────────────────────────────────────────────────────

export const createTeamMemberSchema = z.object({
  name: nonEmptyString(100),
  role: nonEmptyString(100),
  bio: z.string().max(1_000).optional(),
  photoUrl: optionalUrl,
  linkedIn: optionalUrl,
  twitter: optionalUrl,
  instagram: optionalUrl,
  displayOrder: z.number().int().optional(),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

// ─── Resources ────────────────────────────────────────────────────────────────

export const createResourceSchema = z.object({
  title: nonEmptyString(300),
  description: z.string().max(1_000).optional(),
  url: z.string().url('Resource URL must be a valid URL'),
  type: z.enum(['BOOK', 'ARTICLE', 'YOUTUBE']),
  thumbnailUrl: optionalUrl,
});

export const updateResourceSchema = createResourceSchema.partial();

// ─── Users (admin) ────────────────────────────────────────────────────────────

const VALID_ROLES = ['SUPER_ADMIN', 'BLOG_MODERATOR', 'FORUM_MODERATOR', 'EVENTS_MODERATOR', 'MEMBER'];

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
  name: nonEmptyString(100),
  roles: z.union([z.string(), z.array(z.string())]).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
  roles: z.union([z.string(), z.array(z.string())]).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128).optional(),
});

// ─── Utility: validate and return 400 on failure ─────────────────────────────

/**
 * Validates `body` against `schema`.
 * Returns { data } on success or { error: NextResponse } on failure.
 */
export function validate(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    const messages = issues.map((e) => `${e.path.join('.') || 'field'}: ${e.message}`);
    return {
      error: NextResponse.json(
        { error: 'Validation failed', details: messages },
        { status: 400 }
      ),
    };
  }
  return { data: result.data };
}

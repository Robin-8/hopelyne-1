// Role constants
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  BLOG_MODERATOR: 'BLOG_MODERATOR',
  FORUM_MODERATOR: 'FORUM_MODERATOR',
  EVENTS_MODERATOR: 'EVENTS_MODERATOR',
  MEMBER: 'MEMBER',
};

// Parse comma-separated roles string into array
export function parseRoles(rolesString) {
  if (!rolesString) return [ROLES.MEMBER];
  return rolesString.split(',').map(r => r.trim()).filter(Boolean);
}

// Check if user has a specific role
export function hasRole(user, role) {
  if (!user?.roles) return false;
  const roles = parseRoles(user.roles);
  if (roles.includes(ROLES.SUPER_ADMIN)) return true; // Super admin has all roles
  return roles.includes(role);
}

// Check if user has any of the specified roles
export function hasAnyRole(user, roleList) {
  if (!user?.roles) return false;
  const roles = parseRoles(user.roles);
  if (roles.includes(ROLES.SUPER_ADMIN)) return true;
  return roleList.some(role => roles.includes(role));
}

// Check if user is super admin
export function isSuperAdmin(user) {
  return hasRole(user, ROLES.SUPER_ADMIN);
}

// Check if user can manage blogs
export function canManageBlogs(user) {
  return hasAnyRole(user, [ROLES.SUPER_ADMIN, ROLES.BLOG_MODERATOR]);
}

// Check if user can manage forum
export function canManageForum(user) {
  return hasAnyRole(user, [ROLES.SUPER_ADMIN, ROLES.FORUM_MODERATOR]);
}

// Check if user can manage events
export function canManageEvents(user) {
  return hasAnyRole(user, [ROLES.SUPER_ADMIN, ROLES.EVENTS_MODERATOR]);
}

// Get role display label
export function getRoleLabel(role) {
  const labels = {
    SUPER_ADMIN: 'Super Admin',
    BLOG_MODERATOR: 'Blog Moderator',
    FORUM_MODERATOR: 'Forum Moderator',
    EVENTS_MODERATOR: 'Events Moderator',
    MEMBER: 'Member',
  };
  return labels[role] || role;
}

// Forum topic statuses
export const TOPIC_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
};

// Blog post statuses
export const POST_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
};

// Event types
export const EVENT_TYPE = {
  UPCOMING: 'UPCOMING',
  PAST: 'PAST',
};

// Resource types
export const RESOURCE_TYPE = {
  BOOK: 'BOOK',
  ARTICLE: 'ARTICLE',
  YOUTUBE: 'YOUTUBE',
};

// Forum categories
export const FORUM_CATEGORIES = [
  'Peer Pressure',
  'Parental Pressure',
  'Self-Care & Wellness',
  'Academic Stress',
  'General Support',
];

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { hash } from 'bcryptjs';
import * as userModel from '@/models/userModel';
import { validate, createUserSchema, updateUserSchema } from '@/lib/validation';

function extractRoles(userRoles) {
  if (Array.isArray(userRoles)) return userRoles;
  if (typeof userRoles === 'string') return userRoles.split(',').map(r => r.trim()).filter(Boolean);
  return [];
}

export async function getUsers() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = extractRoles(session.user.roles);
    if (!roles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await userModel.getAllUsers();
    const formattedUsers = users.map(u => ({
      ...u,
      roles: extractRoles(u.roles)
    }));
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Users GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function createUser(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionRoles = extractRoles(session.user.roles);
    if (!sessionRoles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { data, error } = validate(createUserSchema, body);
    if (error) return error;

    let rolesString = 'MEMBER';
    if (Array.isArray(data.roles)) {
      rolesString = data.roles.length > 0 ? data.roles.join(',') : 'MEMBER';
    } else if (typeof data.roles === 'string' && data.roles.trim()) {
      rolesString = data.roles.trim();
    }

    const passwordHash = await hash(data.password, 12);
    const user = await userModel.createUser({
      email: data.email,
      passwordHash,
      name: data.name,
      roles: rolesString,
    });

    return NextResponse.json({
      ...user,
      roles: extractRoles(user.roles)
    }, { status: 201 });
  } catch (error) {
    console.error('Users POST error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create user', details: [error.message] }, { status: 500 });
  }
}

export async function getUserById(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = extractRoles(session.user.roles);
    if (!roles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const user = await userModel.getUserById(id);

    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({
      ...user,
      roles: extractRoles(user.roles)
    });
  } catch (error) {
    console.error('User GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function updateUser(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionRoles = extractRoles(session.user.roles);
    if (!sessionRoles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { data, error } = validate(updateUserSchema, body);
    if (error) return error;

    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.roles !== undefined) {
      updateData.roles = Array.isArray(data.roles) ? data.roles.join(',') : (data.roles || 'MEMBER');
    }
    if (data.password) {
      updateData.passwordHash = await hash(data.password, 12);
    }

    const user = await userModel.updateUser(id, updateData);
    return NextResponse.json({
      ...user,
      roles: extractRoles(user.roles)
    });
  } catch (error) {
    console.error('User PUT error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function deleteUser(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const roles = extractRoles(session.user.roles);
    if (!roles.includes('SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    if (id === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    await userModel.deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('User DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

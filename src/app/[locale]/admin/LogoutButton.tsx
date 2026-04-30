'use client';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function LogoutButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-baby-50 hover:text-baby-500"
    >
      <LogOut className="h-4 w-4" />
      {label}
    </button>
  );
}

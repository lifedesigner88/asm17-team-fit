import { useState, type ReactNode } from "react";
import { useLoaderData } from "react-router-dom";

import { Button, ShellCard, StatusPill } from "@/common/components";
import { LogoutButton } from "@/features/auth";

import { revokeVerification } from "../api";
import type { AdminUser } from "../types";

const STATUS_META: Record<string, { label: string; tone: "default" | "success" | "warn" }> = {
  none: { label: "미인증", tone: "default" },
  pending: { label: "대기 중", tone: "warn" },
  approved: { label: "인증 완료", tone: "success" },
  rejected: { label: "거부됨", tone: "default" }
};

function formatStatus(status: string | undefined) {
  return STATUS_META[status ?? "none"] ?? { label: status ?? "알 수 없음", tone: "default" };
}

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.082 3.292 9.387 7.862 10.91.575.105.787-.25.787-.556 0-.275-.01-1.004-.016-1.97-3.197.694-3.873-1.54-3.873-1.54-.523-1.328-1.277-1.681-1.277-1.681-1.044-.714.079-.699.079-.699 1.155.081 1.763 1.187 1.763 1.187 1.027 1.76 2.695 1.252 3.35.957.103-.744.402-1.252.732-1.54-2.552-.29-5.236-1.276-5.236-5.682 0-1.255.448-2.282 1.183-3.086-.119-.29-.513-1.458.112-3.04 0 0 .965-.309 3.163 1.179A11.02 11.02 0 0 1 12 6.07c.977.004 1.962.132 2.882.387 2.196-1.488 3.16-1.179 3.16-1.179.627 1.582.233 2.75.114 3.04.737.804 1.181 1.831 1.181 3.086 0 4.417-2.689 5.389-5.251 5.673.413.355.781 1.054.781 2.126 0 1.535-.014 2.773-.014 3.15 0 .309.207.667.793.554C20.213 21.383 23.5 17.08 23.5 12 23.5 5.648 18.352.5 12 .5Z" />
    </svg>
  );
}

function NotionIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <rect
        x="4.25"
        y="4.25"
        width="15.5"
        height="15.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M9 16V8.4l5.6 7.2V8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalIconButton({
  href,
  title,
  children,
}: {
  href?: string | null;
  title: string;
  children: ReactNode;
}) {
  const className =
    "inline-flex h-9 w-9 items-center justify-center rounded-xl border transition";

  if (!href) {
    return (
      <span
        aria-label={title}
        title={title}
        className={`${className} border-border/50 bg-white/50 text-muted-foreground/35`}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={title}
      title={title}
      className={`${className} border-border/60 bg-white/80 text-foreground/70 hover:border-foreground/20 hover:bg-white hover:text-foreground`}
    >
      {children}
    </a>
  );
}

export function AdminUsersPage() {
  const loadedUsers = useLoaderData() as AdminUser[];
  const [users, setUsers] = useState(loadedUsers);
  const [processing, setProcessing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRevoke(userId: number) {
    setProcessing(userId);
    setError(null);
    try {
      await revokeVerification(userId);
      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === userId
            ? {
                ...user,
                applicant_status: "none"
              }
            : user
        )
      );
    } catch {
      setError("인증 취소에 실패했습니다.");
    } finally {
      setProcessing(null);
    }
  }

  return (
    <ShellCard className="overflow-hidden bg-white/92 p-0">
      <div className="border-b border-border/80 bg-[linear-gradient(180deg,rgba(248,246,241,0.95),rgba(255,255,255,0.92))] px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <StatusPill label="Admin only" />
            <h2 className="text-2xl font-semibold tracking-[-0.03em]">전체 회원 관리</h2>
            <p className="text-sm text-muted-foreground">
              가입자와 현재 인증 상태를 확인하고, 필요하면 승인된 인증을 취소할 수 있습니다.
            </p>
          </div>
          <div className="shrink-0">
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="overflow-x-auto px-6 py-4">
        {error && (
          <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/80 text-left text-muted-foreground">
              <th className="py-3 font-medium">이름 / 이메일</th>
              <th className="py-3 font-medium">User ID</th>
              <th className="py-3 font-medium">초대코드 / 링크</th>
              <th className="py-3 font-medium">Role</th>
              <th className="py-3 font-medium">인증 상태</th>
              <th className="py-3 font-medium">Created At</th>
              <th className="py-3 font-medium text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const status = formatStatus(user.applicant_status);

              return (
                <tr className="border-b border-border/60 last:border-b-0" key={user.user_id}>
                  <td className="py-4">
                    <div className="font-medium text-foreground">{user.name ?? "이름 없음"}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </td>
                  <td className="py-4 font-medium text-foreground">{user.user_id}</td>
                  <td className="py-4">
                    <div className="space-y-2">
                      <div className="inline-flex rounded-lg border border-border/70 bg-white/80 px-2.5 py-1 font-mono text-xs text-foreground/80">
                        {user.invite_code ?? "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalIconButton
                          href={user.github_address}
                          title={user.github_address ? `GitHub 열기: ${user.github_address}` : "GitHub 링크 없음"}
                        >
                          <GithubIcon />
                        </ExternalIconButton>
                        <ExternalIconButton
                          href={user.notion_url}
                          title={user.notion_url ? `Notion 열기: ${user.notion_url}` : "Notion 링크 없음"}
                        >
                          <NotionIcon />
                        </ExternalIconButton>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <StatusPill
                      label={user.is_admin ? "admin" : "member"}
                      tone={user.is_admin ? "success" : "default"}
                    />
                  </td>
                  <td className="py-4">
                    <StatusPill label={status.label} tone={status.tone} />
                  </td>
                  <td className="py-4 text-muted-foreground">
                    {new Date(user.created_at).toLocaleString()}
                  </td>
                  <td className="py-4 text-right">
                    {!user.is_admin && user.applicant_status === "approved" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-stone-200 bg-white/90 text-stone-700 hover:bg-stone-50"
                        disabled={processing === user.user_id}
                        onClick={() => handleRevoke(user.user_id)}
                      >
                        인증 취소
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ShellCard>
  );
}

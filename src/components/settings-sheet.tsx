"use client";

import { Download, Moon, RotateCcw, Sun, Upload, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Segmented } from "@/components/ui/choice";
import { Sheet } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { todayKey } from "@/lib/date";
import { exportBackup, importBackup, resetEverything, saveSettings } from "@/lib/repo";
import {
  getServerSpeechSnapshotCached,
  getSpeechSnapshotCached,
  setSpeechAccent,
  speak,
  subscribeSpeechState,
} from "@/lib/speech";
import { BOTTOM_LINE } from "@/lib/copy";
import type { BackupFile, SpeechAccent, ThemeMode } from "@/lib/types";

/** 主题与本机数据。从「我的」页进入：所有数据都在这台设备上，不上传。 */
export function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { mode, setMode } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);
  // 口音和音色都得问浏览器要。用 useSyncExternalStore 读：服务端给固定值，
  // 客户端挂载后自动换成真值 —— 既不会水合不一致，也不用在 effect 里 setState。
  const speech = useSyncExternalStore(
    subscribeSpeechState,
    getSpeechSnapshotCached,
    getServerSpeechSnapshotCached,
  );

  async function handleExport() {
    setBusy(true);
    try {
      const backup = await exportBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `cet6-backup-${todayKey()}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
      toast({ title: "存好了", description: "在你的下载文件夹里。" });
    } catch {
      toast({ title: "导出失败", description: "请重试一次。", tone: "warn" });
    } finally {
      setBusy(false);
    }
  }

  async function handleImport(file: File) {
    setBusy(true);
    try {
      const text = await file.text();
      const payload = JSON.parse(text) as BackupFile;
      await importBackup(payload);
      toast({ title: "恢复好了", description: "马上就好。" });
      setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      setBusy(false);
      toast({
        title: "无法恢复这个文件",
        description: error instanceof Error ? error.message : "请确认是本产品导出的 JSON 备份。",
        tone: "warn",
      });
    }
  }

  async function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    await resetEverything();
    router.replace("/welcome");
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow="Me"
      title="设置"
      description={BOTTOM_LINE.privacy}
      footer={
        <Button block size="lg" onClick={onClose}>
          完成
        </Button>
      }
    >
      <div className="space-y-5 pb-2">
        <section>
          <h3 className="mb-2.5 text-label font-black tracking-[-0.02em]">主题</h3>
          <Segmented<ThemeMode>
            value={mode}
            onChange={setMode}
            options={[
              { value: "light", label: "浅色" },
              { value: "dark", label: "深色" },
              { value: "system", label: "跟随系统" },
            ]}
          />
          <p className="mt-2 flex items-center gap-1.5 text-caption text-fg-muted">
            {mode === "dark" ? (
              <Moon className="size-3.5" aria-hidden />
            ) : (
              <Sun className="size-3.5" aria-hidden />
            )}
            {mode === "system" ? "当前跟随系统设置" : `当前为${mode === "dark" ? "深色" : "浅色"}模式`}
          </p>
        </section>

        <section>
          <h3 className="mb-2.5 text-label font-black tracking-[-0.02em]">发音</h3>
          <Segmented<SpeechAccent>
            value={speech.accent}
            onChange={(next) => {
              setSpeechAccent(next);
              void saveSettings({ speechAccent: next });
            }}
            options={[
              { value: "en-US", label: "美音" },
              { value: "en-GB", label: "英音" },
            ]}
          />
          <p className="mt-2 flex items-center gap-1.5 text-caption text-fg-muted">
            <Volume2 className="size-3.5 shrink-0" aria-hidden />
            <button
              type="button"
              className="tap truncate text-left underline decoration-dotted underline-offset-2"
              onClick={() => speak("vocabulary")}
            >
              {speech.voiceName}
            </button>
          </p>
          <p className="mt-1 text-caption text-fg-subtle">
            默认美音，跟六级听力录音一致。词库音标是英式的。
          </p>
        </section>

        <section>
          <h3 className="mb-2.5 text-label font-black tracking-[-0.02em]">数据备份</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="secondary"
              leadingIcon={<Download className="size-[17px]" />}
              disabled={busy}
              onClick={handleExport}
            >
              导出 JSON
            </Button>
            <Button
              variant="secondary"
              leadingIcon={<Upload className="size-[17px]" />}
              disabled={busy}
              onClick={() => fileRef.current?.click()}
            >
              导入备份
            </Button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleImport(file);
              event.target.value = "";
            }}
          />
          <p className="mt-2 text-caption text-fg-muted">
            导入会覆盖当前设备上的全部记录，建议先导出一份。
          </p>
        </section>

        <section>
          <h3 className="mb-2.5 text-label font-black tracking-[-0.02em]">危险操作</h3>
          <Button
            variant={confirmReset ? "danger" : "soft"}
            block
            leadingIcon={<RotateCcw className="size-[17px]" />}
            onClick={handleReset}
          >
            {confirmReset ? "再点一次确认清空" : "清空本机数据"}
          </Button>
          <p className="mt-2 text-caption text-fg-muted">清空后无法恢复，请先导出备份。</p>
        </section>

        <section className="rounded-card bg-surface-2 p-4">
          <p className="text-caption leading-relaxed text-fg-muted">
            CET-6 Study Companion · 六级备考督学
            <br />
            面向大学生个人的独立备考平台：每天给一条能立刻开始的建议，其余你自己决定。
            <br />
            没有教师后台、没有班级、没有作业 —— 所有建议与反馈都由系统独立完成。
          </p>
        </section>
      </div>
    </Sheet>
  );
}

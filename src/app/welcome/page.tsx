"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useProfileState } from "@/hooks/use-study";
import { Button } from "@/components/ui/button";
import { FlowShell } from "@/components/ui/app-shell";
import { Logo } from "@/components/logo";
import { PageSkeleton } from "@/components/ui/skeleton";
import { copy } from "@/lib/direction-copy";
import { Mood } from "@/components/mood/mood-line";
import { BOTTOM_LINE } from "@/lib/copy";

const PROMISES = [
  { k: "01", zh: "填一次信息，给你这周的建议" },
  { k: "02", zh: "每天只看今天，不用自己排计划" },
  { k: "03", zh: "没做完不追责，下次接着来" },
];

export default function WelcomePage() {
  const router = useRouter();
  const { profile, loaded } = useProfileState();

  useEffect(() => {
    if (loaded && profile) router.replace("/today");
  }, [loaded, profile, router]);

  if (!loaded || profile) {
    return (
      <FlowShell>
        <PageSkeleton />
      </FlowShell>
    );
  }

  return (
    <FlowShell>
      <div className="flex min-h-dvh flex-col">
        {/* colour field — lime bleeding off the top, headline inside */}
        <div className="color-field px-5 pt-[max(28px,env(safe-area-inset-top))] pb-10">
          <span aria-hidden className="sticker -top-12 -right-10 size-40 bg-lavender" />
          <span aria-hidden className="sticker right-24 -bottom-14 size-28 bg-coral" />

          <div className="relative">
            <Logo tone="onAccent" />
          </div>

          <p className="eyebrow-field relative mt-9">{copy.B.microTitle}</p>
          <h1 className="relative mt-3 text-title font-black tracking-[-0.03em] text-primary-fg">
            <span className="block rotate-tilt-a">{copy.B.headline1}</span>
            <span className="-mt-0.5 block rotate-tilt-b pl-3">{copy.B.headline2}</span>
          </h1>
        </div>

        <div className="flex flex-1 flex-col px-5 pt-7 pb-[max(28px,env(safe-area-inset-bottom))]">
          <ul className="mt-6 space-y-3">
            {PROMISES.map((item, index) => (
              <li
                key={item.k}
                className={`flex items-center gap-3 rounded-row bg-surface px-4 py-3.5 shadow-hard-sm ${
                  index % 2 === 0 ? "rotate-tilt-b" : "-rotate-tilt-a"
                }`}
              >
                <span
                  aria-hidden
                  className={`size-3 shrink-0 rounded-full ${
                    index % 2 === 0 ? "bg-lavender" : "bg-coral"
                  }`}
                />
                <span className="min-w-0 flex-1 text-[14px] font-bold text-fg">{item.zh}</span>
                <span className="num shrink-0 text-[12px] font-bold text-fg-subtle">{item.k}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-8">
            {/* 歌词放在按钮上面：它负责让人放松，按钮仍然是这一屏最后、最好点的东西 */}
            <Mood scene="begin" className="mb-6" />

            <Button
              size="lg"
              block
              trailingIcon={<ArrowRight className="size-[18px]" />}
              onClick={() => router.push("/onboarding")}
            >
              开启我的六级计划
            </Button>

            <p className="mt-4 text-center text-caption text-fg-subtle">
              {BOTTOM_LINE.privacy}
            </p>
          </div>
        </div>
      </div>
    </FlowShell>
  );
}

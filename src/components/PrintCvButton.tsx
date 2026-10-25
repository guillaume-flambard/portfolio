"use client";

type Props = { label: string };
export default function PrintCvButton({ label }: Props) {
  return <button type="button" className="btn p print-cv" onClick={() => window.print()}>{label}</button>;
}

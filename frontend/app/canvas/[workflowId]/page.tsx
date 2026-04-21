"use client";

import { use } from "react";

interface WorkflowCanvasPageProps {
	params: Promise<{
		workflowId: string;
	}>;
}

export default function WorkflowCanvasPage({ params }: WorkflowCanvasPageProps) {
	const { workflowId } = use(params);

	return (
		<main className="min-h-screen p-6">
			<h1 className="text-2xl font-semibold">Canvas page</h1>
			<p className="mt-2 text-sm text-text-secondary">
				Editing workflow ID: <span className="font-mono">{workflowId}</span>
			</p>
		</main>
	);
}
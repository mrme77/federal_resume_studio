import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";

interface AssessmentResultProps {
    result: {
        score: number;
        summary: string;
        strengths: string[];
        gaps: string[];
        recommendations: string[];
    } | null;
}

export function AssessmentResult({ result }: AssessmentResultProps) {
    if (!result) return null;

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-yellow-600";
        return "text-red-600";
    };



    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-primary/20 shadow-lg">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl font-bold text-center">Resume Assessment Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative flex items-center justify-center w-32 h-32 mb-4">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                <circle
                                    className="text-muted/20"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                />
                                <circle
                                    className={getScoreColor(result.score)}
                                    strokeWidth="8"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                />
                            </svg>
                            <span className={`absolute text-3xl font-bold ${getScoreColor(result.score)}`}>
                                {result.score}%
                            </span>
                        </div>
                        <p className="text-center text-muted-foreground max-w-2xl italic">
                            &quot;{result.summary}&quot;
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Strengths */}
                        <div className="space-y-3">
                            <h3 className="flex items-center gap-2 font-semibold text-green-700">
                                <CheckCircle2 className="h-5 w-5" />
                                Key Strengths
                            </h3>
                            <ul className="space-y-2">
                                {result.strengths.map((strength, index) => (
                                    <li key={index} className="flex items-start gap-2 text-base text-foreground bg-green-50/50 dark:bg-green-900/20 p-3 rounded-md border border-green-100 dark:border-green-900">
                                        <span className="mt-1.5 block h-2 w-2 rounded-full bg-green-600 dark:bg-green-400 shrink-0" />
                                        {strength}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Gaps */}
                        <div className="space-y-3">
                            <h3 className="flex items-center gap-2 font-semibold text-amber-700 dark:text-amber-400 text-lg">
                                <AlertCircle className="h-5 w-5" />
                                Areas for Improvement
                            </h3>
                            <ul className="space-y-2">
                                {result.gaps.map((gap, index) => (
                                    <li key={index} className="flex items-start gap-2 text-base text-foreground bg-amber-50/50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-100 dark:border-amber-900">
                                        <span className="mt-1.5 block h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400 shrink-0" />
                                        {gap}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Recommendations */}
                    <div className="mt-8 space-y-3">
                        <h3 className="flex items-center gap-2 font-semibold text-blue-700 dark:text-blue-400 text-lg">
                            <Lightbulb className="h-5 w-5" />
                            Actionable Recommendations
                        </h3>
                        <div className="grid gap-3">
                            {result.recommendations.map((rec, index) => (
                                <div key={index} className="flex items-start gap-3 p-4 bg-blue-50/30 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900">
                                    <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                    <span className="text-base text-foreground">{rec}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import { NavLink } from "react-router-dom";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/common/components";

import type { PersonaResult } from "../utils/types";

export function PersonaCard({ result }: { result: PersonaResult }) {
  return (
    <Card className="border-teal-200 bg-[linear-gradient(160deg,rgba(240,253,250,0.98),rgba(236,254,255,0.92))]">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="success">Persona ready</Badge>
          <NavLink to={`/persona/${result.persona_id}`}>
            <Button size="sm" variant="outline">
              View public profile →
            </Button>
          </NavLink>
        </div>
        <CardTitle className="text-2xl tracking-[-0.03em]">{result.archetype}</CardTitle>
        <p className="text-sm leading-7 text-muted-foreground">{result.one_liner}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Top values
          </div>
          <div className="flex flex-wrap gap-2">
            {result.top3_values.map((value) => (
              <span
                key={value}
                className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800"
              >
                {value}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

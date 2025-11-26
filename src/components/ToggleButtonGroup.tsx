"use client";
import { Grid2X2, Table } from "lucide-react";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";

type Props = {
  state: [
    "grid" | "table",
    React.Dispatch<React.SetStateAction<"grid" | "table">>,
  ];
};
export default function ToggleButtonGroup({ state }: Props) {
  const [toggleState, setState] = state;
  return (
    <ButtonGroup>
      <Button
        variant={toggleState === "grid" ? "primary" : "outline"}
        onClick={() => setState("grid")}
        aria-pressed={toggleState === "grid"}
      >
        <Grid2X2 />
      </Button>
      <Button
        variant={toggleState === "table" ? "primary" : "outline"}
        onClick={() => setState("table")}
        aria-pressed={toggleState === "table"}
      >
        <Table />
      </Button>
    </ButtonGroup>
  );
}

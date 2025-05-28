import { StakingData } from "./table.config";

  export const tableData: StakingData[] = [
    {
      id: "3",
      cooldown: "00:00:00",
      weight: 10,
      rewards: "3.5 LBGT",
      action: {
        label: "Claim",
        variant: "default",
        className: "bg-orange-500 hover:bg-orange-600 text-white",
        onClick: () => console.log("Claim clicked for ID 3"),
      },
    },
    {
      id: "2",
      cooldown: "11:09:01",
      weight: 10,
      rewards: "3.5 LBGT",
      action: {
        label: "Cooldown",
        variant: "secondary",
        isDisabled: true,
        onClick: () => console.log("Cooldown clicked for ID 2"),
      },
    },
    {
      id: "1",
      cooldown: "00:00:00",
      weight: 10,
      rewards: "3.5 LBGT",
      action: {
        label: "Claimed",
        variant: "outline",
        isDisabled: true,
        onClick: () => console.log("Claimed clicked for ID 1"),
      },
    },
  ]
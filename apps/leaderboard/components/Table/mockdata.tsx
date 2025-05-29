import { StakingData } from "./table.config";

  export const tableData: StakingData[] = [
    {
      id: "4",
      cooldown: "00:00:00",
      weight: 15,
      rewards: "6.9 LBGT",
      action: {
        label: "Claimed",
        variant: "outline",
        isDisabled: true,
        className: "bg-gray-300 text-white px-2 py-1 rounded-md",
        onClick: () => console.log("Claimed clicked for ID 4"),
      },
    },
    {
      id: "7",
      cooldown: "02:15:30",
      weight: 25,
      rewards: "12.8 LBGT",
      action: {
        label: "Claim",
        variant: "default",
        className: "bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded-md",
        onClick: () => console.log("Claim clicked for ID 7"),
      },
    },
    {
      id: "9",
      cooldown: "01:20:15",
      weight: 35,
      rewards: "18.2 LBGT",
      action: {
        label: "Claim",
        variant: "default",
        className: "bg-orange-400 hover:bg-orange-500 text-white px-2 py-1 rounded-md",
        onClick: () => console.log("Claim clicked for ID 9"),
      },
    },
    {
      id: "15",
      cooldown: "08:45:22",
      weight: 50,
      rewards: "27.3 LBGT",
      action: {
        label: "Cooldown",
        variant: "secondary",
        isDisabled: true,
        className: "bg-gray-300 text-white px-2 py-1 rounded-md",
        onClick: () => console.log("Cooldown clicked for ID 15"),
      },
    },
    {
      id: "22",
      cooldown: "14:30:45",
      weight: 75,
      rewards: "45.7 LBGT",
      action: {
        label: "Cooldown",
        variant: "secondary",
        isDisabled: true,
        className: "bg-gray-300 text-white px-2 py-1 rounded-md",
        onClick: () => console.log("Cooldown clicked for ID 22"),
      },
    },
  ]
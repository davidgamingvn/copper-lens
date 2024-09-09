import { type NewsItem } from "../news";

export const mockNews: NewsItem[] = [
  {
    id: 1,
    title:
      "Arizona Residents Fear What the State's Mining Boom Will Do to Their Water",
    image: "/placeholder.svg?height=80&width=120",
    summary: [
      "Nearly 80 percent of Arizona lacks any form of groundwater",
      "allowing big users like the copper mines supplying",
      "energy transition to consume vast amounts of the scarce resource.",
    ],
  },
  {
    id: 2,
    title: "New Water Conservation Measures Implemented in Arizona Mining",
    image: "/placeholder.svg?height=80&width=120",
    summary: [
      "State officials introduce strict water usage regulations for mining operations",
      "Mining companies required to invest in water-saving technologies",
      "Environmental groups cautiously optimistic about the new measures",
    ],
  },
  {
    id: 3,
    title: "Innovative Technologies Reduce Water Consumption in Copper Mining",
    image: "/placeholder.svg?height=80&width=120",
    summary: [
      "Advanced filtration systems recycle up to 85% of water used in mining processes",
      "Dry-stack tailings method significantly reduces water requirements",
      "Industry leaders collaborate on developing water-efficient extraction techniques",
    ],
  },
];

export type RobuxPackage = {
  id: string;
  robux: number;
  price: number;       // in cents
  officialPrice: number; // in cents (Roblox's official price)
  label: string;
  popular?: boolean;
};

export const PACKAGES: RobuxPackage[] = [
  {
    id: "pkg_7000",
    robux: 7000,
    price: 3599,
    officialPrice: 6999,
    label: "7K ROBUX",
  },
  {
    id: "pkg_14000",
    robux: 14000,
    price: 7099,
    officialPrice: 12999,
    label: "14K ROBUX",
  },
  {
    id: "pkg_1700",
    robux: 21000,
    price: 9999,
    officialPrice: 19999,
    label: "21K ROBUX",
    popular: true,
  },
  {
    id: "pkg_28000",
    robux: 28000,
    price: 13999,
    officialPrice: 24999,
    label: "28K ROBUX",
  },
];

export function getPackageById(id: string): RobuxPackage | undefined {
  return PACKAGES.find((p) => p.id === id);
}

export function savingsPercent(pkg: RobuxPackage): number {
  return Math.round(((pkg.officialPrice - pkg.price) / pkg.officialPrice) * 100);
}

export interface Step {
  number: number;
  text: string;
}

export const stepsIntro = "Forget sliced meats, we’re slicing dough:";

export const steps: Step[] = [
  {
    number: 1,
    text: "Roll chilled dough to desired thickness (say 5mm, we like em’ thick)",
  },
  {
    number: 2,
    text: "Cut to your favourite shapes (who can go past a gingerbread person)",
  },
  {
    number: 3,
    text: "Bake @t 180°C for 8-10 minutes (unless you like them dark and crunchy, who are we to judge)",
  },
  {
    number: 4,
    text: "Cool on a wire rack (or devour from the oven at your own risk!)",
  },
];

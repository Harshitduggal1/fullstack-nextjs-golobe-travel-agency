import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
export function Rating({ className, setRating }) {
  return (
    <ToggleGroup
      type="multiple"
      onValueChange={(value) => {
        setRating(value);
      }}
      className={cn("w-full", className)}
    >
      <ToggleGroupItem
        className="data-[state='on']:bg-primary/20 border border-primary"
        name={"star1"}
        value="1"
        aria-label="Toggle 1 star"
      >
        +1
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state='on']:bg-primary/20 border border-primary"
        name={"star2"}
        value="2"
        aria-label="Toggle 2 star"
      >
        +2
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state='on']:bg-primary/20 border border-primary"
        name={"star3"}
        value="3"
        aria-label="Toggle 3 star"
      >
        +3
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state='on']:bg-primary/20 border border-primary"
        name={"star4"}
        value="4"
        aria-label="Toggle 4 star"
      >
        +4
      </ToggleGroupItem>
      <ToggleGroupItem
        className="data-[state='on']:bg-primary/20 border border-primary"
        name={"star5"}
        value="5"
        aria-label="Toggle 5 star"
      >
        +5
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

export default Rating;

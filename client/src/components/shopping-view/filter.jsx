import { filterOptions } from "@/config";
import { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ShoppingFilter({ filters, handleFilter }) {
  return (
    <div className="bg-background rounded-lg shadow-lg">
      <div className="p-4 border-b">
        <div className="font-extrabold text-lg">Filters</div>
        <div className="font-bold">
          {Object.keys(filterOptions).map((keyItem, index) => (
            <Fragment key={index}>
              <div className="mt-4">
                <h3 className="font-semibold">{keyItem}</h3>
                <div className="grid gap-3 mt-2">
                  {filterOptions[keyItem].map((options) => (
                    <Label
                      key={options.id}
                      className="flex font-medium items-center gap-2"
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(options.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilter(keyItem, options.id)
                        }
                        className="bg-white peer shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground !h-1 !w-1"
                      />
                      {options.label}
                    </Label>
                  ))}
                </div>
              </div>
              <Separator className="my-4" />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShoppingFilter;

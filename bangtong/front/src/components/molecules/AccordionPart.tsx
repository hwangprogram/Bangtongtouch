import React from "react";
import { AccordionItem as Item } from "@szhsin/react-accordion";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

// AccordionItemProps 타입 정의
interface AccordionItemProps {
  header: string;
  initialEntered?: boolean;
  children: React.ReactNode;
}

const AccordionPart: React.FC<AccordionItemProps> = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        {header}
        <ChevronDownIcon
          className={`ml-auto transition-transform duration-200 ease-out w-4 h-4 ${
            isEnter ? "rotate-180" : ""
          }`}
        />
      </>
    )}
    className="border border-black rounded-xl mb-2"
    buttonProps={{
      className: ({ isEnter }) =>
        `flex items-center w-full p-4 text-left hover:bg-slate-100 rounded-xl ${
          isEnter ? "bg-slate-200" : ""
        }`,
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out",
    }}
    panelProps={{ className: "p-4" }}
  />
);

export default AccordionPart;

import React from 'react';
import { BsChevronDoubleRight } from 'react-icons/bs';
import { Link } from 'react-router-dom'; // or 'next/link' if you're using Next.js

type BreadcrumbItem = {
  label: string;
  href?: string; // Optional – no href means it's the current page
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="text-sm md:text-base leading-none text-black">
      <ol className="flex items-center flex-wrap md:gap-x-2 gap-x-1 lg:text-[16px] md:text-[14px] text-[12px]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {item.href && !isLast ? (
                <li className='font-light'>
                  <Link to={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li>
                  <span className="font-semibold ">
                    {item.label}
                  </span>
                </li>
              )}
              {!isLast && (
                <li>
                  <span>
                    <BsChevronDoubleRight  /> 
                  </span>
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

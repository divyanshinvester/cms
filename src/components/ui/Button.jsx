import React from "react";
import Link from "next/link";

function Button({
  variant = "primary",
  children,
  href,
  as = "button",
  className = "",
  isLoading = false,
  ...props
}) {
  // Remove isLoading from DOM props
  const domProps = { ...props };

  const baseClass = "px-s24 py-s16 text-center h-fit rounded-r40 hover:cursor-pointer";

  const variants = {
    primary: "body-default bg-primary-main text-background hover:bg-primary-light hover:text-main",
    navigation:"body-default bg-foreground text-background hover:bg-primary-light",
 secondary:"body-default bg-primary-main text-background hover:bg-background hover:text-main"
  };

  const allClasses = `
    ${baseClass}
    ${variants[variant] || variants.primary}
    ${className}
    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
  `;

  // LINK BUTTON
  if (as === "link" && href) {
    return (
      <Link href={href} className={allClasses} {...domProps}>
        {isLoading ? "Loading..." : children}
      </Link>
    );
  }

  // NORMAL BUTTON
  return (
    <button
      className={allClasses}
      disabled={isLoading || domProps.disabled}
      {...domProps}
    >
      { children}
    </button>
  );
}

export default Button;

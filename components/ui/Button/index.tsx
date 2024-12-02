import Link from 'next/link';

interface ButtonProps {
  title: string;
  className?: string;
  href: string;
  target?: string;
}

const Button = ({title, className, href, target}: ButtonProps) => {
  return (
    <Link href={href} target={target} className={className} title={title}>
      {title}
    </Link>
  );
};

export default Button;

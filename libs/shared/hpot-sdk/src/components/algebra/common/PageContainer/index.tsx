interface PageContainerProps {
  children: React.ReactNode;
}

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div className="max-w-screen-xl mx-auto w-full flex flex-col items-center justify-center px-2 sm:px-4 md:px-8">
      {children}
    </div>
  );
};

export default PageContainer;

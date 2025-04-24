export const ChainNotSupport = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center gap-y-2">
        <div className="text-2xl font-bold">Chain Not Supported</div>
        <div className="text-sm text-gray-500">
          This chain does not support Universal Account
        </div>
      </div>
    </div>
  );
};

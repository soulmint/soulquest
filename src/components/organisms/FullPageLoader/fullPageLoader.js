import NextNprogress from 'nextjs-progressbar';

const FullPageLoader = () => {
  return (
    <NextNprogress
      options={{ showSpinner: false }}
      color="#8B5CF6"
      startPosition={0.3}
      stopDelayMs={200}
      height={3}
      showOnShallow={true}
    />
  );
};

export default FullPageLoader;

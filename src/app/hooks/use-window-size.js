const useWindowSize = () => {
  const isIpadSize = window.innerWidth <= 992;

  return {
    isIpadSize,
  };
};

export default useWindowSize;

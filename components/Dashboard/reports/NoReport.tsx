const NoReport = () => {
  return (
    <div className="flex justify-center md:mt-36 mt-24">
      <div>
        <div className="flex justify-center">
          <div className="empty-boxes">
            <div className="content-box empty-box animate-1"></div>
            <div className="content-box empty-box"></div>
            <div className="content-box empty-box"></div>
            <div className="content-box empty-box animate-2"></div>
          </div>
        </div>
        <div className="text-center mt-2 text-xl font-semibold">
          No Reports to Show
        </div>
        <div className="!text-sm text-secondary-300 text-center mt-3">
          Start by creating the new Report for the dashboard
        </div>
      </div>
    </div>
  );
};

export default NoReport;

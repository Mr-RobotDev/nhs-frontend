const NoDashboardSelected = () => {
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
          No Dashboard Selected
        </div>
        <div className="!text-sm text-secondary-300 text-center mt-3">
          Select a dashboard to view it here or create a new one by clicking the
          menu button in the top left corner.
        </div>
      </div>
    </div>
  );
};

export default NoDashboardSelected;

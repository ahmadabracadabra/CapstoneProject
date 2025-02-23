const Announcements = () => {
  return (
    <div className="bg-white p-4 rounded-md">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Announcements</h1>
            <span className="text-xs text-gray-400 cursor-pointer">View All</span>
        </div>
        <div className="flex flex-col gap-4 mt-4">
            <div className="bg-blue rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Lorem ipsum dolor sit amet </h2>
                <span className="text-xs text-grey-400 bg-white rounded-md px-1 py-1">Date</span>
          </div>
            <p className="text-sm text-gray-400 mt-1">lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
        <div className="bg-lamaPurpleLight rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Lorem ipsum dolor sit amet </h2>
                <span className="text-xs text-grey-400 bg-white rounded-md px-1 py-1">Date</span>
          </div>
            <p className="text-sm text-gray-400 mt-1">lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div> 
        <div className="bg-blue rounded-md p-4">
            <div className="flex items-center justify-between">
                <h2 className="font-medium">Lorem ipsum dolor sit amet </h2>
                <span className="text-xs text-grey-400 bg-white rounded-md px-1 py-1">Date</span>
          </div>
            <p className="text-sm text-gray-400 mt-1">lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>       
      </div>
    </div>
  )
}

export default Announcements
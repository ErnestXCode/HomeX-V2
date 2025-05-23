import React from 'react'

const ListingsPlaceholder = () => {
  return (
    <div className="ml-3 mr-3 animate-pulse">
      <div className="bg-gray-600/50 mt-3 p-3 rounded-2xl mb-10">
        <section className="">
          <div className="relative">
            <div className="w-[100%] h-64 bg-gray-700 object-cover rounded-2xl mb-2" ></div>
          </div>
        </section>
        <div className="w-50 bg-gray-700 h-5 mt-2 rounded-2xl"></div>
        <div className="w-50 bg-gray-700 h-5 mt-2 rounded-2xl"></div>
        <div className="w-50 bg-gray-700 h-5 mt-2 rounded-2xl"></div>

        <div className="flex justify-end m-1">
          <div className="w-14 h-5 rounded-xl bg-gray-700"></div>
        </div>
      </div>
    </div>
  )
}

export default ListingsPlaceholder

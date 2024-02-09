import React from 'react'

export default function Loader() {
  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-blue-500"></div>
          </div>
      </div>
  )
}
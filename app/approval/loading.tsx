import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileCheck } from "lucide-react"

export default function ApprovalLoading() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 min-h-screen">
      {/* 页面头部加载状态 */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <FileCheck className="w-8 h-8 mr-3 text-blue-600" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      {/* 统计概览加载状态 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-l-4 border-l-blue-500 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 搜索和筛选加载状态 */}
      <Card className="border-l-4 border-l-blue-500 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="flex-1 h-10" />
            <Skeleton className="w-48 h-10" />
            <Skeleton className="w-48 h-10" />
          </div>
        </CardContent>
      </Card>

      {/* 审批列表加载状态 */}
      <Card className="border-l-4 border-l-blue-500 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center">
            <FileCheck className="w-5 h-5 mr-2 text-blue-600" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-l-4 border-l-blue-500 bg-blue-50 rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-64" />
                      <div className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-6 w-12 rounded-full" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

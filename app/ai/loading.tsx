import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Brain } from "lucide-react"

export default function AILoading() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50 min-h-screen">
      {/* 页面头部加载状态 */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <Brain className="w-8 h-8 mr-3 text-purple-600" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="flex space-x-3">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* AI功能概览加载状态 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI助手对话加载状态 */}
      <Card className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-20" />
            </div>
            <div className="bg-purple-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 ml-11">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI功能模块加载状态 */}
      <Card className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-l-4 border-l-purple-500 bg-purple-50 rounded-xl p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>

                <div className="flex justify-end">
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI洞察建议加载状态 */}
      <Card className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2 rounded" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Skeleton className="w-5 h-5 rounded mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

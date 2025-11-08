"use client"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import axios from "axios"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Loader2, CalendarDays, LogIn } from "lucide-react"

interface GoogleEvent {
  summary: string
  start: { dateTime: string }
  end: { dateTime: string }
}

const TodaySchedule = () => {
  const sessionResult = useSession()
  const session = sessionResult?.data
  const status = sessionResult?.status
  const [events, setEvents] = useState<GoogleEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)

  

useEffect(() => {
  if (!session?.accessToken) return;

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/calendar/today`, {
        accessToken: session.accessToken,
      });
      setEvents(res.data.items || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
 finally {
      setIsLoading(false);
    }
  };

  fetchEvents();
}, [session?.accessToken]);


  

  // Show loading state while session is being determined
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-950 p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl">
            <CardContent className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                <p className="text-sm text-gray-400">Loading session...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Show sign-in prompt if not authenticated
  if (status === "unauthenticated" || !session) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 ">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
                  <Calendar className="w-6 h-6 text-blue-400" />
                </div>
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-gray-800 rounded-full mb-4 border border-gray-700">
                  <LogIn className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">Sign in required</h3>
                <p className="text-gray-400 max-w-sm mb-4">
                  Please sign in with your Google account to view your calendar events.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 ">
      <div className="max-w-4xl mx-auto w-90">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              <div className="p-2 bg-gray-800 rounded-lg border border-gray-700">
                <Calendar className="w-6 h-6 text-blue-400" />
              </div>
              Today's Schedule
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">{format(new Date(), "EEEE, MMMM do, yyyy")}</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                  <p className="text-sm text-gray-400">Loading your events...</p>
                </div>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-gray-800 rounded-full mb-4 border border-gray-700">
                  <CalendarDays className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">No events today</h3>
                <p className="text-gray-400 max-w-sm">
                  Looks like you have a free day! Time to relax or plan something spontaneous.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">
                    {events.length} event{events.length !== 1 ? "s" : ""} scheduled
                  </span>
                </div>

                <div className="grid gap-3 max-h-[500px] overflow-y-auto "
                style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#8b5cf6 #1f2937',
        }}>
                  {events.map((event, i) => (
                    <Card
                      key={i}
                      className="group hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 border border-gray-700 bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 group-hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/30"></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-100 mb-2 group-hover:text-blue-400 transition-colors">
                              {event.summary}
                            </h4>

                            <div className="flex items-center gap-2 text-sm text-gray-400">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium text-gray-300">
                                {format(new Date(event.start.dateTime), "h:mm a")}
                              </span>
                              <span className="text-gray-600">—</span>
                              <span className="font-medium text-gray-300">
                                {format(new Date(event.end.dateTime), "h:mm a")}
                              </span>
                            </div>

                            <div className="mt-2 text-xs text-gray-500">
                              Duration:{" "}
                              {Math.round(
                                (new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime()) /
                                  (1000 * 60),
                              )}{" "}
                              minutes
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default TodaySchedule

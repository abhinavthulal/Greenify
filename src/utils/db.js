import { supabase } from './supabase'

// Get current statistics
export async function getStats() {
  try {
    const { data, error } = await supabase
      .from('site_stats')
      .select('*')
      .single()

    if (error) throw error
    
    return {
      photosTotal: data?.total_photos || 0,
      visitorsTotal: data?.total_visitors || 0,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return { photosTotal: 0, visitorsTotal: 0 }
  }
}

// Get today's count
export async function getDailyStats() {
  try {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('daily_upload_counts')
      .select('photo_count')
      .eq('date', today)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    
    return data?.photo_count || 0
  } catch (error) {
    console.error('Error fetching daily stats:', error)
    return 0
  }
}

// Increment visitor count
export async function incrementVisitor() {
  try {
    const { data, error } = await supabase
      .from('site_stats')
      .select('total_visitors')
      .single()

    if (error) throw error

    const newCount = (data?.total_visitors || 0) + 1

    const { error: updateError } = await supabase
      .from('site_stats')
      .update({ total_visitors: newCount })
      .eq('id', 1)

    if (updateError) throw updateError
  } catch (error) {
    console.error('Error incrementing visitor:', error)
  }
}

// Increment photo count
export async function incrementPhotoCount(count = 1) {
  try {
    const today = new Date().toISOString().split('T')[0]

    // Update daily count
    const { data: dailyData } = await supabase
      .from('daily_upload_counts')
      .select('photo_count')
      .eq('date', today)
      .single()

    const dailyCount = (dailyData?.photo_count || 0) + count

    await supabase
      .from('daily_upload_counts')
      .upsert({
        date: today,
        photo_count: dailyCount,
      })

    // Update total count
    const { data: totalData } = await supabase
      .from('site_stats')
      .select('total_photos')
      .single()

    const newTotal = (totalData?.total_photos || 0) + count

    await supabase
      .from('site_stats')
      .update({ total_photos: newTotal })
      .eq('id', 1)
  } catch (error) {
    console.error('Error incrementing photo count:', error)
  }
}

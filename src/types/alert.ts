export type AlertSeverity = 'critical' | 'high' | 'moderate' | 'informational';

export type AlertType =
  | 'weather'
  | 'pest'
  | 'disease'
  | 'crop_health'
  | 'market'
  | 'government'
  | 'system';

export interface FarmAlert {
  id: string;
  user_id?: string;
  alert_type: AlertType;
  title: string;
  title_mr?: string;
  description: string;
  severity: AlertSeverity;
  crop?: string;
  location: string;
  source: string;
  source_url?: string;
  action_text?: string;
  action_route?: string; // '/crop-doctor', '/market', '/schemes', etc.
  is_read: boolean;
  created_at: string;
  updated_at?: string;
  expires_at?: string;
  
  // Rich Contextual Metadata
  rainfall_mm?: number;
  expected_hours?: number;
  market_name?: string;
  current_price?: string;
  price_change?: string;
  scheme_name?: string;
  scheme_deadline?: string;
  verified_by?: string;
  recommended_actions?: string[];
}

export interface NotificationSettings {
  sms_alerts: boolean;
  push_notifications: boolean;
  email_notifications: boolean;
  weather_alerts: boolean;
  pest_alerts: boolean;
  market_alerts: boolean;
  scheme_alerts: boolean;
}

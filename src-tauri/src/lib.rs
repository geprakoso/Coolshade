#[tauri::command]
async fn pick_color() -> Result<String, String> {
    #[cfg(target_os = "linux")]
    {
        use ashpd::desktop::Color;

        let response = Color::pick()
            .send()
            .await
            .map_err(|e| format!("PickColor failed: {}", e))?
            .response()
            .map_err(|e| format!("PickColor response failed: {}", e))?;

        let r = (response.red() * 255.0).round() as u8;
        let g = (response.green() * 255.0).round() as u8;
        let b = (response.blue() * 255.0).round() as u8;

        Ok(format!("#{r:02x}{g:02x}{b:02x}"))
    }

    #[cfg(not(target_os = "linux"))]
    {
        Err("Use browser EyeDropper API on this platform".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![pick_color])
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

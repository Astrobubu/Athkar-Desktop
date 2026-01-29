use tauri::{Manager, Runtime, WebviewUrl, WebviewWindowBuilder, Emitter};
use tauri_plugin_store::StoreExt;
use tauri_plugin_updater::UpdaterExt;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
pub struct Settings {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub window_position: Option<WindowPosition>,
    #[serde(default = "default_font_size")]
    pub font_size: i32,
    #[serde(default = "default_true")]
    pub play_sound: bool,
    #[serde(default)]
    pub dark_mode: bool,
}

fn default_font_size() -> i32 {
    22
}

fn default_true() -> bool {
    true
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct WindowPosition {
    x: i32,
    y: i32,
}

// Load settings from store
#[tauri::command]
async fn load_settings<R: Runtime>(app: tauri::AppHandle<R>) -> Result<Settings, String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    
    let settings = Settings {
        window_position: store.get("windowPosition").and_then(|v| serde_json::from_value(v).ok()),
        font_size: store.get("fontSize").and_then(|v| v.as_i64()).unwrap_or(22) as i32,
        play_sound: store.get("playSound").and_then(|v| v.as_bool()).unwrap_or(true),
        dark_mode: store.get("darkMode").and_then(|v| v.as_bool()).unwrap_or(false),
    };
    
    Ok(settings)
}

// Save settings to store
#[tauri::command]
async fn save_settings<R: Runtime>(
    app: tauri::AppHandle<R>,
    settings: Settings,
) -> Result<(), String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    
    if let Some(pos) = &settings.window_position {
        store.set("windowPosition", serde_json::to_value(pos).unwrap());
    }
    store.set("fontSize", serde_json::to_value(settings.font_size).unwrap());
    store.set("playSound", serde_json::to_value(settings.play_sound).unwrap());
    store.set("darkMode", serde_json::to_value(settings.dark_mode).unwrap());
    store.save().map_err(|e| e.to_string())?;
    
    // Notify main window of settings update
    if let Some(main_window) = app.get_webview_window("main") {
        let _ = main_window.emit("settings-updated", &settings);
    }
    
    Ok(())
}

// Save window position
#[tauri::command]
async fn save_window_position<R: Runtime>(
    app: tauri::AppHandle<R>,
    x: i32,
    y: i32,
) -> Result<(), String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    let pos = WindowPosition { x, y };
    store.set("windowPosition", serde_json::to_value(&pos).unwrap());
    store.save().map_err(|e| e.to_string())?;
    Ok(())
}

// Load window position
#[tauri::command]
async fn load_window_position<R: Runtime>(
    app: tauri::AppHandle<R>,
) -> Result<Option<WindowPosition>, String> {
    let store = app.store("settings.json").map_err(|e| e.to_string())?;
    
    if let Some(pos) = store.get("windowPosition") {
        let position: Option<WindowPosition> = serde_json::from_value(pos).ok();
        return Ok(position);
    }
    
    Ok(None)
}

// Open settings window
#[tauri::command]
async fn open_settings<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    // Check if settings window already exists
    if let Some(settings_window) = app.get_webview_window("settings") {
        let _ = settings_window.set_focus();
        return Ok(());
    }
    
    // Load current settings to determine background color
    let settings = load_settings(app.clone()).await.unwrap_or_default();
    
    let main_window = app.get_webview_window("main").ok_or("Main window not found")?;
    
    let settings_window = WebviewWindowBuilder::new(&app, "settings", WebviewUrl::App("/settings.html".into()))
        .title("الإعدادات")
        .inner_size(400.0, 520.0)
        .min_inner_size(400.0, 520.0)
        .max_inner_size(400.0, 520.0)
        .decorations(false)
        .resizable(false)
        .parent(&main_window)
        .map_err(|e| e.to_string())?
        .build()
        .map_err(|e| e.to_string())?;
    
    // Apply background color based on dark mode
    if settings.dark_mode {
        let _ = settings_window.eval("document.body.classList.add('dark')");
    }
    
    // Show the window after creation
    let _ = settings_window.show();
    
    Ok(())
}

// Close app (hide to tray)
#[tauri::command]
async fn close_app<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.hide();
    }
    Ok(())
}

// Minimize app
#[tauri::command]
async fn minimize_app<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.minimize();
    }
    Ok(())
}

// Resize window
#[tauri::command]
async fn resize_window<R: Runtime>(
    app: tauri::AppHandle<R>,
    height: i32,
) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.set_size(tauri::Size::Physical(tauri::PhysicalSize::new(320, height.max(400) as u32)));
    }
    Ok(())
}

// Reset progress
#[tauri::command]
async fn reset_progress<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    if let Some(main_window) = app.get_webview_window("main") {
        let _ = main_window.emit("reset-progress", ());
    }
    Ok(())
}

// Close settings window
#[tauri::command]
async fn close_settings<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("settings") {
        let _ = window.close();
    }
    Ok(())
}

// Update check command
#[tauri::command]
async fn check_for_update(app: tauri::AppHandle) -> Result<Option<serde_json::Value>, String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    
    match updater.check().await {
        Ok(Some(update)) => {
            Ok(Some(serde_json::json!({
                "version": update.version,
                "notes": update.body
            })))
        }
        Ok(None) => Ok(None),
        Err(e) => Err(e.to_string())
    }
}

// Install update command
#[tauri::command]
async fn install_update(app: tauri::AppHandle) -> Result<(), String> {
    let updater = app.updater().map_err(|e| e.to_string())?;
    
    if let Some(update) = updater.check().await.map_err(|e| e.to_string())? {
        update.download_and_install(|_, _| {}, || {}).await.map_err(|e| e.to_string())?;
    }
    
    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            // Show main window immediately
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
            
            // Load saved position and apply to main window
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                if let Ok(Some(pos)) = load_window_position(app_handle.clone()).await {
                    if let Some(window) = app_handle.get_webview_window("main") {
                        let _ = window.set_position(tauri::Position::Physical(tauri::PhysicalPosition::new(pos.x, pos.y)));
                    }
                }
            });

            // Listen for window move events to save position
            let main_window = app.get_webview_window("main").unwrap();
            let app_handle = app.handle().clone();
            main_window.on_window_event(move |event| {
                if let tauri::WindowEvent::Moved(position) = event {
                    let app_handle = app_handle.clone();
                    let x = position.x;
                    let y = position.y;
                    tauri::async_runtime::spawn(async move {
                        let _ = save_window_position(app_handle, x, y).await;
                    });
                }
            });

            // Setup tray icon
            #[cfg(all(desktop, not(debug_assertions)))]
            {
                use tauri::tray::{TrayIconBuilder, TrayIconEvent};
                use tauri::menu::{MenuBuilder, MenuItemBuilder};
                
                let show_i = MenuItemBuilder::new("إظهار").id("show").build(app)?;
                let hide_i = MenuItemBuilder::new("إخفاء").id("hide").build(app)?;
                let settings_i = MenuItemBuilder::new("الإعدادات").id("settings").build(app)?;
                let quit_i = MenuItemBuilder::new("خروج").id("quit").build(app)?;
                
                let menu = MenuBuilder::new(app)
                    .item(&show_i)
                    .item(&hide_i)
                    .separator()
                    .item(&settings_i)
                    .separator()
                    .item(&quit_i)
                    .build()?;
                
                let _tray = TrayIconBuilder::new()
                    .menu(&menu)
                    .show_menu_on_left_click(false)
                    .on_menu_event(|app, event| match event.id.as_ref() {
                        "show" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.show();
                                let _ = window.set_focus();
                            }
                        }
                        "hide" => {
                            if let Some(window) = app.get_webview_window("main") {
                                let _ = window.hide();
                            }
                        }
                        "settings" => {
                            let app = app.clone();
                            tauri::async_runtime::spawn(async move {
                                let _ = open_settings(app).await;
                            });
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    })
                    .on_tray_icon_event(|tray, event| match event {
                        TrayIconEvent::DoubleClick { .. } => {
                            let app = tray.app_handle();
                            if let Some(window) = app.get_webview_window("main") {
                                if window.is_visible().unwrap_or(true) {
                                    let _ = window.hide();
                                } else {
                                    let _ = window.show();
                                    let _ = window.set_focus();
                                }
                            }
                        }
                        _ => {}
                    })
                    .build(app)?;
            }
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            load_settings,
            save_settings,
            save_window_position,
            load_window_position,
            open_settings,
            close_app,
            minimize_app,
            resize_window,
            reset_progress,
            close_settings,
            check_for_update,
            install_update
        ])
        .on_window_event(|window, event| {
            match event {
                tauri::WindowEvent::CloseRequested { api, .. } => {
                    // Prevent closing, hide instead (keep in tray)
                    if window.label() == "main" {
                        api.prevent_close();
                        let _ = window.hide();
                    }
                }
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

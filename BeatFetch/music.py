import os
import subprocess

def download_playlist_as_mp3(playlist_url, download_folder):
    if not os.path.exists(download_folder):
        os.makedirs(download_folder)
    
    print(f"Downloading playlist: {playlist_url}")
    
    try:
        # Use yt-dlp to download and convert to MP3
        command = [
            "yt-dlp",
            "--extract-audio",
            "--audio-format", "mp3",
            "--output", os.path.join(download_folder, "%(title)s.%(ext)s"),
            playlist_url
        ]
        subprocess.run(command, check=True)
        print(f"All music videos downloaded and converted to MP3 in {download_folder}!")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred during download: {e}")

if __name__ == "__main__":
    playlist_url = input("Enter the YouTube playlist URL: ")
    download_folder = input("Enter the folder path to save MP3 files: ")
    download_playlist_as_mp3(playlist_url, download_folder)

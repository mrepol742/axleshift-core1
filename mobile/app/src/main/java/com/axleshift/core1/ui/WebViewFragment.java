package com.axleshift.core1.ui;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.axleshift.core1.databinding.FragmentWebviewBinding;

import java.util.Objects;

public class WebViewFragment extends Fragment {

    private FragmentWebviewBinding binding;
    private DrawerLocker drawerLocker;

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        if (context instanceof DrawerLocker) {
            drawerLocker = (DrawerLocker) context;
        } else {
            throw new RuntimeException(context.toString() + " must implement DrawerLocker");
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container, Bundle savedInstanceState) {
        binding = FragmentWebviewBinding.inflate(inflater, container, false);
        View root = binding.getRoot();

        final WebView webView = binding.webView;
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                checkCookieAndShowDrawer(url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url != null && Objects.equals(Uri.parse(url).getHost(), "core1.axleshift.com")) {
                    return false;
                } else {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
            }
        });
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setDatabaseEnabled(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // this is for incoming urls
        Intent intent = requireActivity().getIntent();
        String action = intent.getAction();
        Uri data = intent.getData();

        if (Intent.ACTION_VIEW.equals(action) && data != null) {
            if (data.getHost().equals("core1.axleshift.com")) {
                webView.loadUrl(data.toString());
            } else {
                Intent browserIntent = new Intent(Intent.ACTION_VIEW, data);
                startActivity(browserIntent);
            }
        } else {
            webView.loadUrl("https://core1.axleshift.com");
        }
        return root;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    private void checkCookieAndShowDrawer(String url) {
        CookieManager cookieManager = CookieManager.getInstance();
        String cookies = cookieManager.getCookie(url);
        Toast.makeText(requireActivity(), cookies, Toast.LENGTH_SHORT).show();

        if (cookies != null) {
            if (cookies.contains("RCTSESSION1")) {
                drawerLocker.setDrawerLocked(false);
            } else {
                drawerLocker.setDrawerLocked(true);
            }
        } else {
            drawerLocker.setDrawerLocked(true);
        }
    }
}
clean_2005 <- function(df, year, month) {
  
  df_filtered <- df %>%
    rename(
      consulado_id = "Consulado",
      consulado = "...4",
      pais_id = "País",
      pais = "...2",) %>%
    mutate(year = year) %>%
    filter(consulado_id %in% c(303,
                            304,
                            306,
                            308,
                            310,
                            312,
                            314,
                            316,
                            318,
                            320)
    ) %>%
    select_if(~!all(is.na(.)))
  
  if (month == "words") {
    df_filtered <- df_filtered %>%
      rename(
        censo_12 = paste0("a 1-dic-", year),
        censo_11 = paste0("a 1-nov-", year),
        censo_10 = paste0("a 1-oct-", year),
        censo_09 = paste0("a 1-sep-", year),
        censo_08 = paste0("a 1-ago-", year),
        censo_07 = paste0("a 1-jul-", year),
        censo_06 = paste0("a 1-jun-", year),
        censo_05 = paste0("a 1-may-", year),
        censo_04 = paste0("a 1-abr-", year),
        censo_03 = paste0("a 1-mar-", year),
        censo_02 = paste0("a 1-feb-", year),
        censo_01 = paste0("a 1-ene-", year)
      );
  } else {
    df_filtered <- df_filtered %>%
      rename(
        censo_12 = paste0("a 1-12-", year),
        censo_11 = paste0("a 1-11-", year),
        censo_10 = paste0("a 1-10-", year),
        censo_09 = paste0("a 1-09-", year),
        censo_08 = paste0("a 1-08-", year),
        censo_07 = paste0("a 1-07-", year),
        censo_06 = paste0("a 1-06-", year),
        censo_05 = paste0("a 1-05-", year),
        censo_04 = paste0("a 1-04-", year),
        censo_03 = paste0("a 1-03-", year),
        censo_02 = paste0("a 1-02-", year),
        censo_01 = paste0("a 1-01-", year)
      );
  }
  
}

clean_2006 <- function(df, year, month) {
  
  df_filtered <- df %>%
    rename(
      consulado_id = "Oficina consular",
      consulado = "...4",
      pais_id = "País de residencia",
      pais = "...2") %>%
    filter(consulado_id %in% c(303,
                               304,
                               306,
                               308,
                               310,
                               312,
                               314,
                               316,
                               318)
    ) %>%
    mutate(year = year) %>%
    select_if(~!all(is.na(.)))
  
  if (month == "words") {
    df_filtered <- df_filtered %>%
      rename(
        censo_12 = paste0("a 1-dic-", year),
        censo_11 = paste0("a 1-nov-", year),
        censo_10 = paste0("a 1-oct-", year),
        censo_09 = paste0("a 1-sep-", year),
        censo_08 = paste0("a 1-ago-", year),
        censo_07 = paste0("a 1-jul-", year),
        censo_06 = paste0("a 1-jun-", year),
        censo_05 = paste0("a 1-may-", year),
        censo_04 = paste0("a 1-abr-", year),
        censo_03 = paste0("a 1-mar-", year),
        censo_02 = paste0("a 1-feb-", year),
        censo_01 = paste0("a 1-ene-", year)
      );
  } else if (month == "number") {
    df_filtered <- df_filtered %>%
      rename(
        censo_12 = paste0("a 1-12-", year),
        censo_11 = paste0("a 1-11-", year),
        censo_10 = paste0("a 1-10-", year),
        censo_09 = paste0("a 1-09-", year),
        censo_08 = paste0("a 1-08-", year),
        censo_07 = paste0("a 1-07-", year),
        censo_06 = paste0("a 1-06-", year),
        censo_05 = paste0("a 1-05-", year),
        censo_04 = paste0("a 1-04-", year),
        censo_03 = paste0("a 1-03-", year),
        censo_02 = paste0("a 1-02-", year),
        censo_01 = paste0("a 1-01-", year)
      );
  } else if (month == "number2") {
    df_filtered <- df_filtered %>%
      rename(
        censo_12 = paste0("a 1-12-", year),
        censo_11 = paste0("a 1-11-", year),
        censo_10 = paste0("a 1-10-", year),
        censo_09 = paste0("a 1-9-", year),
        censo_08 = paste0("a 1-8-", year),
        censo_07 = paste0("a 1-7-", year),
        censo_06 = paste0("a 1-6-", year),
        censo_05 = paste0("a 1-5-", year),
        censo_04 = paste0("a 1-4-", year),
        censo_03 = paste0("a 1-3-", year),
        censo_02 = paste0("a 1-2-", year),
        censo_01 = paste0("a 1-1-", year)
      );
  }
  
}

clean_2014 <- function(df, year, month) {
  df_filtered <- df %>%
    rename(
      consulado_id = "...3",
      consulado = "...4",
      pais_id = "...1",
      pais = "...2"
      ) %>%
    filter(pais_id %in% c(302)) %>%
    mutate(year = year) %>%
    select_if( ~ !all(is.na(.)))
  
  if (month == "month") {
    df_filtered <- df_filtered %>%
      rename(
        censo_12 = paste0("a 1-dic-", year),
        censo_11 = paste0("a 1-nov-", year),
        censo_10 = paste0("a 1-oct-", year),
        censo_09 = paste0("a 1-sep-", year),
        censo_08 = paste0("a 1-ago-", year),
        censo_07 = paste0("a 1-jul-", year),
        censo_06 = paste0("a 1-jun-", year),
        censo_05 = paste0("a 1-may-", year),
        censo_04 = paste0("a 1-abr-", year),
        censo_03 = paste0("a 1-mar-", year),
        censo_02 = paste0("a 1-feb-", year),
        censo_01 = paste0("a 1-ene-", year)
      );
  } else {
    df_filtered <- df_filtered %>%
      rename(
        censo_12 = paste0("a 1-12-", year),
        censo_11 = paste0("a 1-11-", year),
        censo_10 = paste0("a 1-10-", year),
        censo_09 = paste0("a 1-09-", year),
        censo_08 = paste0("a 1-08-", year),
        censo_07 = paste0("a 1-07-", year),
        censo_06 = paste0("a 1-06-", year),
        censo_05 = paste0("a 1-05-", year),
        censo_04 = paste0("a 1-04-", year),
        censo_03 = paste0("a 1-03-", year),
        censo_02 = paste0("a 1-02-", year),
        censo_01 = paste0("a 1-01-", year)
      );
  } 
  
  df_filtered
  
}


clean_2021 <- function(df, year) {
  
  df_filtered <- df %>%
    rename(
      consulado_id = "Oficina consular",
      consulado = "...4",
      pais_id = "País de residencia",
      pais = "...2", 
      censo_12 = paste0("Censo cerrado a 1-dic-", year),
      censo_11 = paste0("Censo cerrado a 1-nov-", year),
      censo_10 = paste0("Censo cerrado a 1-oct-", year),
      censo_09 = paste0("Censo cerrado a 1-sep-", year),
      censo_08 = paste0("Censo cerrado a 1-ago-", year),
      censo_07 = paste0("Censo cerrado a 1-jul-", year),
      censo_06 = paste0("Censo cerrado a 1-jun-", year),
      censo_05 = paste0("Censo cerrado a 1-may-", year),
      censo_04 = paste0("Censo cerrado a 1-abr-", year),
      censo_03 = paste0("Censo cerrado a 1-mar-", year),
      censo_02 = paste0("Censo cerrado a 1-feb-", year),
      censo_01 = paste0("Censo cerrado a 1-ene-", year),
    ) %>% 
    mutate(year = year) %>%
    filter(pais_id %in% c(302)
    ) %>%
    select_if(~!all(is.na(.)))
  
  df_filtered
  
}
